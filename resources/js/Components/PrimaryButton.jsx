export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-yellow-500/40 transition duration-150 ease-in-out hover:bg-yellow-300 hover:shadow-yellow-400/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-slate-950 active:bg-yellow-500 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
