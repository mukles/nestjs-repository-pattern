import { AnimatedTooltip } from "@repo/ui/components/ui-kit/animated-tooltip";
import { Logo } from "../components/logo";
import { Borders } from "./login/_components/borders";
import { ProductFeatures } from "./login/_components/product-features";

const people = [
  {
    id: 1,
    name: "Ava Thompson",
    designation: "Product Manager",
    image: "/images/educators/educator_avatar_1_1769667282209.png",
  },
  {
    id: 2,
    name: "Liam Carter",
    designation: "Lead Designer",
    image: "/images/educators/educator_avatar_2_1769667301297.png",
  },
  {
    id: 3,
    name: "Sophia Lee",
    designation: "Frontend Engineer",
    image: "/images/educators/educator_avatar_3_1769667316538.png",
  },
  {
    id: 4,
    name: "Noah Patel",
    designation: "Backend Developer",
    image: "/images/educators/educator_avatar_4_1769667335754.png",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      <div className="flex h-full min-h-screen w-full">
        <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
      </div>
      <div className="relative z-20 hidden w-full items-center justify-center overflow-hidden border-l border-neutral-100 bg-gray-50 md:flex dark:border-neutral-800 dark:bg-neutral-900">
        <Borders />
        <div className="relative z-30 mx-auto max-w-xl p-8 text-center">
          <div className="mb-10 flex w-full flex-row items-center justify-center">
            <AnimatedTooltip items={people} />
            <div className="ml-6 text-left">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Trusted by Developers & Founders
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Join our community of dedicated educators who are
              </p>
            </div>
          </div>

          <div className="mt-10">
            <ProductFeatures />
          </div>
        </div>
      </div>
    </div>
  );
}
