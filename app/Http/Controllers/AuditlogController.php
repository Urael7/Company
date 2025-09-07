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
        'auditlogs' => Auditlog::all()
    ]);
    }



}
