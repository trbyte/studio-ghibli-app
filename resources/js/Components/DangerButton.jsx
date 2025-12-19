export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/40 transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 active:bg-red-700 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
