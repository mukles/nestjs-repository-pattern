import { BarChart2, ShieldCheck, Users, Sliders, Zap } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="text-primary size-7" />,
    title: "Role-Based Access",
    description: "Granular permissions and secure access for every user role.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <BarChart2 className="text-primary size-7" />,
    title: "Powerful Analytics",
    description: "Gain insights with real-time data and comprehensive reports.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <Users className="text-primary size-7" />,
    title: "Seamless Integrations",
    description: "Connect with your favorite tools and platforms effortlessly.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: <Zap className="text-primary size-7" />,
    title: "Fast & Reliable",
    description:
      "Experience lightning-fast performance and robust reliability.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: <Sliders className="text-primary size-7" />,
    title: "Highly Customizable",
    description:
      "Personalize every aspect of your dashboard, workflows, and user experience to perfectly fit your needs.",
    color: "bg-purple-100 text-purple-600",
  },
];

export function ProductFeatures() {
  return (
    <div className="mt-10 flex flex-col gap-5">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white/80 p-3.5 shadow-xs transition-shadow dark:bg-neutral-900/80"
        >
          <div
            className={`flex flex-shrink-0 items-center justify-center rounded-lg p-2 ${feature.color}`}
          >
            {feature.icon}
          </div>
          <div>
            <div className="mb-1 text-left text-lg font-semibold text-neutral-900 dark:text-white">
              {feature.title}
            </div>
            <div className="text-left text-sm text-neutral-600 dark:text-neutral-400">
              {feature.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
