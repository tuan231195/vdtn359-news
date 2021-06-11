import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import React, { useEffect } from 'react';
import { useStateRef } from 'src/utils/hooks/basic';
import { AnimatePresence, motion } from 'framer-motion';

const ScrollTop = styled(motion.div)`
    display: inline-block;
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
`;

const ScrollButton = styled(Button)`
    width: 50px;
    height: 50px;
    text-align: center;
`;
export function ScrollTopButton() {
    const [isScrolled, setIsScrolled] = useStateRef(false);
    useEffect(() => {
        const listener = () => {
            if (window.scrollY > 0 && !isScrolled()) {
                setIsScrolled(true);
            } else if (isScrolled() && !window.scrollY) {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', listener);
        return () => {
            window.removeEventListener('scroll', listener);
        };
    }, []);

    return (
        <AnimatePresence>
            {isScrolled() && (
                <ScrollTop
                    initial={{ bottom: '-60px' }}
                    animate={{ bottom: '30px' }}
                    exit={{ bottom: '-60px' }}
                >
                    <ScrollButton
                        circular
                        color={'orange'}
                        icon={'arrow up'}
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            })
                        }
                    />
                </ScrollTop>
            )}
        </AnimatePresence>
    );
}
