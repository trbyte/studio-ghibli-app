export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-yellow-400/30 bg-slate-800/60 text-yellow-400 shadow-sm focus:ring-yellow-400/50 focus:border-yellow-400/50 ' +
                className
            }
        />
    );
}
