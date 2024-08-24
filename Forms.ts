import { ActionFormData, ModalFormData, MessageFormData } from '@minecraft/server-ui';
import { Player } from "@minecraft/server"


interface ModalInteractable {
    type: 'toggle' | 'slider' | 'dropdown' | 'textField';
    text: string;
    default: boolean | number | string | string[];
    placeholder: string;
    min: number;
    max: number;
    numStep: number;
    options: string[];
}

interface ActionFormButton {
    text: string;
    texture: string;
}

interface ModalFormOptions {
    title: string;
    interactables: ModalInteractable[];
    actions: Function[];
}

interface ActionFormOptions {
    title: string;
    body: string,
    buttons: ActionFormButton[];
    actions: Function[]
}

export class Forms {
  static async ActionForm(player: Player, options: ActionFormOptions) {
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


  static async ModalForm(player: Player, options: ModalFormOptions) {
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
      actions[0](formValues);
    }).catch(error => {
      console.error(`Failed to show modal form: ${error}`);
    });
  }


  static async MessageForm(player: Player, options: ActionFormOptions) {
    const { title = '', body = '', buttons = [], actions = [] } = options;

    const ui = new MessageFormData();
    ui.title(title);
    ui.body(body);

    ui.button1(buttons[0]?.text);
    ui.button2(buttons[1]?.text);

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
