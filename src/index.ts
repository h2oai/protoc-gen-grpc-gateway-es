#!/usr/bin/env node

import { runNodeJs } from "@bufbuild/protoplugin";

import { createPlugin } from "./plugin.js";

runNodeJs(createPlugin());
