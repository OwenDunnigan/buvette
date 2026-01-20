/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		vibe: import("./utils/vibeEngine").WinnipegContext;
	}
}
