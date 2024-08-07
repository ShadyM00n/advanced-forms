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


    static async ModalForm(player, options) {
      const { title = '', interactables = [], actions = [] } = options;
      const ui = new ModalFormData();
      ui.title(title);
      for (let i = 0; i < interactables.length; i++) {
        const interactable = interactables[i];
        if (typeof interactable !== 'object' || !('type' in interactable)) {
          continue;
        }
        const type = interactable.type;
        let def;
        switch (type) {
          case 'toggle':
            def = interactable.default ?? false;
            ui.toggle(interactable.text, def);
            break;
          case 'slider':
            def = interactable.default ?? 0;
            const valStep = interactable.numStep ?? 1;
            ui.slider(interactable.text, interactable.min, interactable.max, valStep, def);
            break;
          case 'dropdown':
            const options = interactable.options ?? [];
            ui.dropdown(interactable.text, options, 0);
            break;
          case 'textField':
            def = interactable.default ?? '';
            const placeholder = interactable.placeholder ?? '';
            ui.textField(interactable.text, placeholder, def);
            break;
          default:
            console.warn(`Unsupported interactable type: ${type}`);
            continue;
        }
      }
    
      return ui.show(player).then(response => {
        if (response.canceled) return;
        if (!response.formValues) return;
        const formValues = response.formValues;
        if (actions.length > 0 && formValues.length === actions.length) {
          for (let i = 0; i < actions.length; i++) {
            if (typeof actions[i] === 'function') {
              actions[i](formValues[i]);
            }
          }
        }
      }).catch(error => {
        console.error(`Failed to show modal form: ${error}`);
      });
    }
  }
