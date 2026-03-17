# otto-cli

A new CLI generated with oclif

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/otto-cli.svg)](https://npmjs.org/package/otto-cli)
[![Downloads/week](https://img.shields.io/npm/dw/otto-cli.svg)](https://npmjs.org/package/otto-cli)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g otto-cli
$ otto-cli COMMAND
running command...
$ otto-cli (--version)
otto-cli/0.0.0 darwin-arm64 node-v24.12.0
$ otto-cli --help [COMMAND]
USAGE
  $ otto-cli COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`otto-cli hello PERSON`](#otto-cli-hello-person)
- [`otto-cli hello world`](#otto-cli-hello-world)
- [`otto-cli help [COMMAND]`](#otto-cli-help-command)
- [`otto-cli plugins`](#otto-cli-plugins)
- [`otto-cli plugins add PLUGIN`](#otto-cli-plugins-add-plugin)
- [`otto-cli plugins:inspect PLUGIN...`](#otto-cli-pluginsinspect-plugin)
- [`otto-cli plugins install PLUGIN`](#otto-cli-plugins-install-plugin)
- [`otto-cli plugins link PATH`](#otto-cli-plugins-link-path)
- [`otto-cli plugins remove [PLUGIN]`](#otto-cli-plugins-remove-plugin)
- [`otto-cli plugins reset`](#otto-cli-plugins-reset)
- [`otto-cli plugins uninstall [PLUGIN]`](#otto-cli-plugins-uninstall-plugin)
- [`otto-cli plugins unlink [PLUGIN]`](#otto-cli-plugins-unlink-plugin)
- [`otto-cli plugins update`](#otto-cli-plugins-update)

## `otto-cli hello PERSON`

Say hello

```
USAGE
  $ otto-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ otto-cli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/otto-cli/otto-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `otto-cli hello world`

Say hello world

```
USAGE
  $ otto-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ otto-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/otto-cli/otto-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `otto-cli help [COMMAND]`

Display help for otto-cli.

```
USAGE
  $ otto-cli help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for otto-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.38/src/commands/help.ts)_

## `otto-cli plugins`

List installed plugins.

```
USAGE
  $ otto-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ otto-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.58/src/commands/plugins/index.ts)_

## `otto-cli plugins add PLUGIN`

Installs a plugin into otto-cli.

```
USAGE
  $ otto-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into otto-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the OTTO_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the OTTO_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ otto-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ otto-cli plugins add myplugin

  Install a plugin from a github url.

    $ otto-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ otto-cli plugins add someuser/someplugin
```

## `otto-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ otto-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ otto-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.58/src/commands/plugins/inspect.ts)_

## `otto-cli plugins install PLUGIN`

Installs a plugin into otto-cli.

```
USAGE
  $ otto-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into otto-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the OTTO_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the OTTO_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ otto-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ otto-cli plugins install myplugin

  Install a plugin from a github url.

    $ otto-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ otto-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.58/src/commands/plugins/install.ts)_

## `otto-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ otto-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ otto-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.58/src/commands/plugins/link.ts)_

## `otto-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ otto-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otto-cli plugins unlink
  $ otto-cli plugins remove

EXAMPLES
  $ otto-cli plugins remove myplugin
```

## `otto-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ otto-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.58/src/commands/plugins/reset.ts)_

## `otto-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ otto-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otto-cli plugins unlink
  $ otto-cli plugins remove

EXAMPLES
  $ otto-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.58/src/commands/plugins/uninstall.ts)_

## `otto-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ otto-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otto-cli plugins unlink
  $ otto-cli plugins remove

EXAMPLES
  $ otto-cli plugins unlink myplugin
```

## `otto-cli plugins update`

Update installed plugins.

```
USAGE
  $ otto-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.58/src/commands/plugins/update.ts)_

<!-- commandsstop -->
