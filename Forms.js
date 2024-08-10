import { ActionFormData, ModalFormData, MessageFormData } from '@minecraft/server-ui';

/**
 * @typedef {Object} ActionButton
 * @property {string} text - The text displayed on the button.
 * @property {string} [texture] - Optional texture for the button.
 */

/**
 * @typedef {Object} ModalInteractable
 * @property {string} type - The type of interactable ('toggle', 'slider', 'dropdown', 'textField').
 * @property {string} text - The text displayed for the interactable.
 * @property {boolean|number|string|string[]} [default] - The default value (depends on the type).
 * @property {string} [placeholder] - Optional placeholder text for textField.
 * @property {number} [min] - Optional minimum value for slider.
 * @property {number} [max] - Optional maximum value for slider.
 * @property {number} [numStep] - Optional step value for slider.
 * @property {string[]} [options] - Options for dropdown.
 */

/**
 * @typedef {Object} ActionFormOptions
 * @property {string} [title=''] - The title of the form.
 * @property {string} [body=''] - The body text for the form.
 * @property {ActionButton[]} [buttons=[]] - An array of button objects.
 * @property {Function[]} [actions=[]] - An array of functions corresponding to button actions.
 */

/**
 * @typedef {Object} ModalFormOptions
 * @property {string} [title=''] - The title of the form.
 * @property {ModalInteractable[]} [interactables=[]] - An array of interactable objects.
 * @property {Function[]} [actions=[]] - An array of functions corresponding to interactable responses.
 */

export class Forms {
  /**
   * Creates and shows an Action Form to the player.
   * 
   * @param {Player} player - The player to show the form to.
   * @param {ActionFormOptions} options - The options for the Action form.
   * @returns {Promise<void>}
   * 
   * @example
   * await Forms.ActionForm(player, {
   *   title: 'Choose an Option',
   *   body: 'Please select one of the following:',
   *   buttons: [
   *     { text: 'Option 1', texture: 'textures/ui/icon1' },
   *     { text: 'Option 2' }
   *   ],
   *   actions: [
   *     () => console.log('Option 1 selected'),
   *     () => console.log('Option 2 selected')
   *   ]
   * });
   */
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

  /**
   * Creates and shows a Modal Form to the player.
   * 
   * @param {Player} player - The player to show the form to.
   * @param {ModalFormOptions} options - The options for the Modal form.
   * @returns {Promise<void>}
   * 
   * @example
   * await Forms.ModalForm(player, {
   *   title: 'Settings',
   *   interactables: [
   *     { type: 'toggle', text: 'Enable feature', default: true },
   *     { type: 'slider', text: 'Volume', min: 0, max: 100, default: 50, numStep: 10 },
   *     { type: 'dropdown', text: 'Select option', options: ['Option A', 'Option B'] },
   *     { type: 'textField', text: 'Enter name', placeholder: 'Name', default: 'Player' }
   *   ],
   *   actions: [
   *     (formValues) => {
   *       console.log('Form submitted with values:', formValues);
   *     }
   *   ]
   * });
   */
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
      actions[0](formValues);
    }).catch(error => {
      console.error(`Failed to show modal form: ${error}`);
    });
  }

  /**
   * Creates and shows a Message Form to the player.
   * 
   * @param {Player} player - The player to show the form to.
   * @param {ActionFormOptions} options - The options for the Message form.
   * @returns {Promise<void>}
   * 
   * @example
   * await Forms.MessageForm(player, {
   *   title: 'Alert',
   *   body: 'Do you want to proceed?',
   *   buttons: [
   *     { text: 'Yes' },
   *     { text: 'No' }
   *   ],
   *   actions: [
   *     () => console.log('Yes selected'),
   *     () => console.log('No selected')
   *   ]
   * });
   */
  static async MessageForm(player, options) {
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
