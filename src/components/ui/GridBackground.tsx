export function GridBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid Lines */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundSize: "60px 60px",
                    backgroundImage: `
            linear-gradient(to right, rgba(204, 255, 0, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(204, 255, 0, 0.08) 1px, transparent 1px)
          `,
                }}
            />

            {/* Radial Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 80% 50% at 50% 50%, transparent 0%, #050505 100%)`,
                }}
            />

            {/* Subtle center glow */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 50% 40%, rgba(204, 255, 0, 0.05) 0%, transparent 50%)`,
                }}
            />
        </div>
    );
}
