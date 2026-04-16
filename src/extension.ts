import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {layoutManager} from 'resource:///org/gnome/shell/ui/main.js';

import {disableEffect, enableEffect} from './manager/event_manager.js';
import {clearMutterSettingsCache} from './manager/utils.js';

export default class RoundedWindowCornersReborn extends Extension {
    #layoutManagerStartupConnection: number | null = null;

    enable() {
        if (layoutManager._startingUp) {
            // Wait for GNOME Shell to be ready before enabling rounded corners
            this.#layoutManagerStartupConnection = layoutManager.connect(
                'startup-complete',
                () => {
                    enableEffect();

                    layoutManager.disconnect(
                        // biome-ignore lint/style/noNonNullAssertion: Since this happens inside of the connection, there is no way for this to be null.
                        this.#layoutManagerStartupConnection!,
                    );
                },
            );
        } else {
            enableEffect();
        }
    }

    disable() {
        disableEffect();
        clearMutterSettingsCache();

        if (this.#layoutManagerStartupConnection !== null) {
            layoutManager.disconnect(this.#layoutManagerStartupConnection);
            this.#layoutManagerStartupConnection = null;
        }
    }
}
