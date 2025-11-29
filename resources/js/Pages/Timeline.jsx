export default function Timeline() {
  const timeline = [
    {
      title: "Title 1",
      date: "1986",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Title 2",
      date: "1988",
      desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    },
    {
      title: "Title 3",
      date: "1989",
      desc: "Duis aute irure dolor in reprehenderit in voluptate velit.",
    },
  ];

  return (
    <section className="relative w-3/4 mx-auto py-12">

      {/* Vertical center line */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300 transform -translate-x-1/2"></div>

      {timeline.map((item, index) => {
        const isLeft = index % 2 === 0;
        const reverse = index % 2 === 1;

        return (
          <div
            key={index}
            className={`relative w-1/2 py-6 ${
              isLeft ? "pr-8" : "pl-8 ml-auto"
            }`}
          >
            {/* Dot */}
            <div className="absolute top-6 left-1/2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1/2"></div>

            {/* Box */}
            <div className="p-4 border rounded-md bg-white">

              {/* Title + Date (manual swap for real alternation) */}
              {reverse ? (
                <div className="flex justify-between items-center">
                  <span className="text-sm">{item.date}</span>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="text-sm">{item.date}</span>
                </div>
              )}

              {/* Divider */}
              <div className="my-2">
                <hr className="border-t border-gray-400 border-dotted" />
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
