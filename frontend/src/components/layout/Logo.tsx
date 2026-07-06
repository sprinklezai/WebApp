interface LogoProps {
  showSubtitle?: boolean;
}

function Logo({ showSubtitle = true }: LogoProps) {
  return (
    <div className="flex flex-col items-center mb-8">

      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white shadow-lg">
        S
      </div>

      <h1 className="text-3xl font-bold text-slate-800">
        Sprinklez
      </h1>

      {showSubtitle && (
        <p className="mt-2 text-center text-slate-500">
          General Trading LLC
          <br />
          F&amp;B Division
        </p>
      )}

    </div>
  );
}

export default Logo;