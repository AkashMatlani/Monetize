import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { create } from 'zustand';
interface SubscrptionStore {
    subscription: Subscrption[];
    addSubscription: (subscription: Subscrption) => void;
    setSubscription: (subscription: Subscrption[]) => void;
}

export const useSubscrptionStore = create<SubscrptionStore>((set) => ({
    subscription: HOME_SUBSCRIPTIONS,
    addSubscription: (subscription) =>
        set((state) => ({ subscription: [subscription, ...state.subscription] })),
    setSubscription: (subscription) => set({ subscription }),
}))