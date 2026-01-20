/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { ThemeKey } from './themes';

declare global {
	namespace App {
		interface Locals {
			theme: ThemeKey;
			windSpeed: number;
		}
	}
}
