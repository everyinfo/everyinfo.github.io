/*!
 * CalcLex (calclex.com) | Copyright (c) 2026 CalcLex. All rights reserved.
 * Proprietary source code. Unauthorized copying, scraping, redistribution, or AI-assisted reproduction is strictly prohibited.
 *
 * Legacy service worker entry point. Delegates to the /sw.js implementation for
 * installs that fab.js registered on this path in the past. All new registrations use /sw.js.
 */
importScripts("/sw.js");
