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

    interface Subscrption {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        plan?: string;
        category?: string;
        paymentMethod?: string;
        status?: string;
        startDate?: string;
        price: number;
        currency?: string;
        billing: string;
        frequency?: string;
        renewalDate?: string;
        color?: string;
    }
    interface SubscrptionCardProps extends Omit<Subscrption, "id"> {
        expanded: boolean,
        onPress: () => void;
        onCancelPress:? () => void;
        isCancelling?: boolean;
    }
}


export { };

