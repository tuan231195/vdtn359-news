import MobileDetect from 'mobile-detect';
import { isBrowser } from 'src/utils/env';

export const size = {
	mobileS: 320,
	mobileM: 375,
	mobileL: 425,
	tablet: 910,
	laptop: 1024,
	laptopL: 1440,
	desktop: 2560,
};

export const device = {
	mobileS: `(min-width: ${size.mobileS}px)`,
	mobileM: `(min-width: ${size.mobileM}px)`,
	mobileL: `(min-width: ${size.mobileL}px)`,
	tablet: `(min-width: ${size.tablet}px)`,
	laptop: `(min-width: ${size.laptop}px)`,
	laptopL: `(min-width: ${size.laptopL}px)`,
	desktop: `(min-width: ${size.desktop}px)`,
	desktopL: `(min-width: ${size.desktop}px)`,
};

export function getDeviceWidth(userAgent?: string) {
	if (userAgent) {
		const md = new MobileDetect(userAgent);
		if (md.phone()) {
			return size.mobileM;
		} else if (md.tablet()) {
			return size.tablet;
		} else {
			return size.laptop;
		}
	} else if (isBrowser()) {
		return window.innerWidth > 0 ? window.innerWidth : screen.width;
	}
}
