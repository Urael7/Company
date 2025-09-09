export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md  text-sidebar-primary-foreground">
                <img src="/eilogo.png" alt="Ethio Innovation Software Developement" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Ethio Innovation Software Developement</span>
            </div>
        </>
    );
}


// export default function AppLogo() {
//     return (
//         <>
//             <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
//                 {/* Dark mode ON -> show LIGHT-mode icon */}
//                 <img src="/eilogo.png" alt="Ethio Innovation Software Developement" className="block dark:hidden" />
//                 {/* Light mode ON -> show DARK-mode icon */}
//                 <img src="/ethioinnovation.png" alt="Ethio Innovation Software Developement" className="block dark:hidden" />
//             </div>
//             <div className="ml-1 grid flex-1 text-left text-sm">
//                 <span className="mb-0.5 truncate leading-tight font-semibold">Ethio Innovation Software Developement</span>
//             </div>
//         </>
//     );
// }