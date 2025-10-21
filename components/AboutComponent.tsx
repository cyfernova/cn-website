export default function AboutComponent() {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#f5f5f0] text-black">
            <div className="max-w-5xl px-6 md:px-10">
                <h1 className="text-3xl md:text-5xl leading-tight font-light italic">
                    About Me
                </h1>
                <p className="mt-6 text-lg md:text-2xl tracking-wide">
                    This is the about page content.
                </p>
            </div>
        </div>
    );
}
