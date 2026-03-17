import { StatusType } from "@/lib/types";

export const getStatusStyle = (item: StatusType, index: number, currentIndex: number) => {
  let color = "gray";
  let animation = false;

  if (index < currentIndex) {
    color = "green";
  } else if (index === currentIndex) {
    if (item === "More Information Needed") {
      color = "red";
    } else {
      color = "green";
    }
  } else if (index === currentIndex + 1) {
    color = "green";
    animation = true;
  }

  return { color, animation };
};
