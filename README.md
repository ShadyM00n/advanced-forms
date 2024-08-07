# Forms Utility

## Overview

This script defines a `Forms` class with static methods for creating and displaying various types of forms in Minecraft Bedrock Edition using hypothetical APIs (`ActionFormData` and `ModalFormData`). These methods provide ways to present different forms to the player with buttons, sliders, toggles, text fields, and dropdowns.

## How It Works

### `Forms.ActionForm`

The `ActionForm` method takes two arguments:
1. `player`: The player to whom the form will be shown.
2. `options`: An object containing the form's title, body, buttons, and actions.

#### Options Object

- `title` (string, optional): The title of the form.
- `body` (string, optional): The body text of the form.
- `buttons` (array, required): An array of button objects, each with a `text` property and an optional `texture` property.
- `actions` (array, required): An array of functions corresponding to the actions to be taken when each button is pressed.

### `Forms.ModalForm`

The `ModalForm` method takes two arguments:
1. `player`: The player to whom the form will be shown.
2. `options`: An object containing the form's title, interactables, and actions.

#### Options Object

- `title` (string, optional): The title of the form.
- `interactables` (array, required): An array of interactable objects, each with a `type` property and corresponding properties for that type.
- `actions` (array, required): An array of functions corresponding to the actions to be taken based on the interactable inputs.

### Example Usage

#### Action Form

```javascript
import { Forms } from './extensions/Forms';

// Define options for the action form
const options = {
  title: 'Sample Title',
  body: 'Sample Body Text',
  buttons: [
    { text: 'Button 1' },
    { text: 'Button 2', texture: 'path/to/texture' }
  ],
  actions: [
    () => console.log('Button 1 pressed'),
    () => console.log('Button 2 pressed')
  ]
};

// Show the form to a player
Forms.ActionForm(player, options);
```
#### Modal Form

```javascript
async function example2(player) {
  await Forms.ModalForm(player, {
    title: 'Test',
    interactables: [
      { type: 'textField', text: 'Field', placeholder: 'Placeholder', default: 'Default' },
      { type: 'slider', text: 'Slider', min: 0, max: 100, default: 0, numStep: 10 },
      { type: 'toggle', text: 'Toggle', default: false },
      { type: 'dropdown', text: 'Dropdown', options: ['Option 1', 'Option 2'] }
    ],
    actions: [
      (val) => player.sendMessage(`Text field: ${val}`),
      (val) => player.sendMessage(`Slider: ${val}`),
      (val) => player.sendMessage(`Toggle: ${val}`),
      (val) => player.sendMessage(`Dropdown: ${val}`)
    ]
  });
}
```

### Error Handling

- If any button in the `buttons` array is not an object or lacks a `text` property, an error will be thrown.
- If an action corresponding to a button press is not a function, a warning will be logged to the console.

## Requirements

- Ensure you have the `ActionFormData` and `ModalFormData` APIs available in your environment.
- The player object must be valid and capable of receiving a form.

### Dependencies

None specified. This script assumes you have access to the necessary game APIs and objects.

### Installation

1. Copy the `Forms` class script into your project.
2. Import and use the `Forms` methods as demonstrated in the example usage.

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

### Completion
- [x] ActionFormData
- [x] ModalFormData
- [ ] MessageFormData

