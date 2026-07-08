
import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import home from "@/assets/icons/home.png";
import setting from "@/assets/icons/setting.png";
import wallet from "@/assets/icons/wallet.png";

export const icons = {
    home,
    wallet,
    activity,
    setting,
    add,
} as const;

export type IconKey = keyof typeof icons;
