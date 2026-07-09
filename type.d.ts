declare global {
      interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }
    
   interface UpcomingSubscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        price: number;
        currency?: string;
        daysLeft: number;
    }
}


export { };

