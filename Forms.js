import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";


export class Forms {
  static async ActionForm(player, options) {
    const { title = '', body = '', buttons = [], actions = [] } = options;

    const ui = new ActionFormData();
    ui.title(title);
    ui.body(body);

    for (let i = 0; i < buttons.length; i++) {
      if (typeof buttons[i] !== 'object' || !('text' in buttons[i])) {
        throw new Error('Each button must be an object with a "text" property');
      }
      ui.button(buttons[i].text, buttons[i]?.texture);
    }

    return ui.show(player).then(response => {
        if (response.canceled) return;
      if (!actions[response.selection]) return;
        if (typeof actions[response.selection] === 'function') {
          actions[response.selection]();
        } else {
          console.warn(`Action at index ${response.selection} is not a function`);
        }
      });
    }

  }
