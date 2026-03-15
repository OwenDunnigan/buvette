/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		vibe: import("./utils/vibeEngine").WinnipegContext;
	}
}

interface ImportMetaEnv {
  readonly INSTAGRAM_ACCESS_TOKEN: string;
  readonly INSTAGRAM_ACCOUNT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
