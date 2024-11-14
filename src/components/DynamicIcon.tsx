import React from 'react';
import { Icon } from '@iconify/react';
interface IconProps {
    icon: string;
    width?: string | number;
    height?: string | number;
    color?: string;
    [key: string]: any;
}

export const DynamicIcon: React.FC<IconProps> = ({ icon, ...props }) => {

    return (
        <Icon
            icon={icon}
            {...props}
        />
    );
};

