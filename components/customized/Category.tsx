import Image from "next/image";
import {cn} from "@/lib/utils";
import {Progress} from "@/components/ui/progress"

const Category = ({category}: {
  category: {
    name: string;
    count: number;
    totalCount: number
  }
}) => {
  const getTopCategoryStyles = (type: string) => {
    if (type === "Food and Drink") {
      return {
        bg: "bg-blue-25",
        circleBg: "bg-blue-100",
        text: {
          main: "text-blue-900",
          count: "text-blue-700",
        },
        progress: {
          bg: "bg-blue-100",
          indicator: "bg-blue-700",
        },
        icon: "/icons/monitor.svg",
      };
    } else if (type === "Travel") {
      return {
        bg: "bg-success-25",
        circleBg: "bg-success-100",
        text: {
          main: "text-success-900",
          count: "text-success-700",
        },
        progress: {
          bg: "bg-success-100",
          indicator: "bg-success-700",
        },
        icon: "/icons/coins.svg",
      };
    } else {
      return {
        bg: "bg-pink-25",
        circleBg: "bg-pink-100",
        text: {
          main: "text-pink-900",
          count: "text-pink-700",
        },
        progress: {
          bg: "bg-pink-100",
          indicator: "bg-pink-700",
        },
        icon: "/icons/shopping-bag.svg",
      };
    }
  }

  const {
    bg,
    circleBg,
    text: {main, count},
    progress: {bg: progressBg, indicator},
    icon
  } = getTopCategoryStyles(category.name);

  return (
      <div className={cn("gap-[18px] flex p-4 rounded-xl", bg)}>
        <figure className={cn("flex justify-center items-center size-10 rounded-full", circleBg)}>
          <Image src={icon} width={20} height={20} alt={category.name}/>
        </figure>
        <div className="flex w-full flex-1 flex-col gap-2">
          <div className="text-[14px] leading-[20px] flex justify-between">
            <h2 className={cn("font-medium", main)}>{category.name}</h2>
            <h3 className={cn("font-normal", count)}>{category.count}</h3>
          </div>
          <Progress value={(category.count / category.totalCount) * 100} className={cn("h-2 w-full", progressBg)}
                    indicatorClassName={cn("h-2 w-full", indicator)}/>
        </div>
      </div>
  );
};

export default Category;
