<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PermissionModel;
// use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
// use Illuminate\Foundation\Auth\User;
use Spatie\Permission\Models\Permission;
use App\Models\Event;
use App\Models\Auditlog;

class AuditlogController extends Controller
{
    public function index()
    {
        return Inertia::render('auditlogs', [
            'auditlogs' => Auditlog::with('user')->latest('occurred_at')->limit(100)->get(),
        ]);
    }

    public function list(Request $request)
    {
        $this->middleware('permission:View_auditlog_list');

        $query = Auditlog::with('user')->latest('occurred_at');

        if ($request->filled('action')) {
            $query->where('action', $request->string('action'));
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->string('user_id'));
        }
        if ($request->filled('search')) {
            $term = "%".$request->string('search')."%";
            $query->where(function ($q) use ($term) {
                $q->where('message', 'like', $term)
                    ->orWhere('url', 'like', $term)
                    ->orWhere('route_name', 'like', $term)
                    ->orWhere('ip_address', 'like', $term);
            });
        }

        return response()->json([
            'data' => $query->paginate(50),
        ]);
    }
}
