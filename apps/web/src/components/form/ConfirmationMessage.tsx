import { Trigger } from 'src/utils/events/trigger';
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from 'semantic-ui-react';
import { useEffectOnce } from 'src/utils/hooks/basic';

export function useTrigger() {
    return useRef(new Trigger()).current;
}
export function ConfirmationMessage({
    duration = 2000,
    className,
    message,
    trigger,
    initialShown,
    children,
}: {
    duration?: number;
    trigger: Trigger;
    className?: string;
    message?: string;
    initialShown?: boolean;
    children?: any;
}) {
    const [isShown, setIsShown] = useState(initialShown);
    const initialProps = initialShown
        ? { opacity: 1, scale: 1 }
        : { opacity: 0, scale: 0 };
    useEffectOnce(() => {
        trigger.onTrigger(() => {
            setIsShown(!initialShown);
            setTimeout(() => {
                setIsShown(initialShown);
            }, duration);
        });
    });
    return (
        <AnimatePresence>
            {isShown && (
                <motion.div
                    initial={initialProps}
                    animate={{
                        opacity: 1 - initialProps.opacity,
                        scale: 1 - initialProps.scale,
                    }}
                    className={className}
                    exit={initialProps}
                >
                    {children ? (
                        children
                    ) : (
                        <span>
                            <Icon name={'check'} color={'green'} /> {message}
                        </span>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
