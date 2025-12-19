export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm transition duration-150 ease-in-out hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-25 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
