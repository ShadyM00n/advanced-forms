# Forms Utility

## Overview

This script defines a `Forms` class with static methods for creating and displaying different types of forms in Minecraft Bedrock Edition. The available methods include `ActionForm`, `ModalForm`, and `MessageForm`.

## How It Works

### ActionForm

The `ActionForm` method creates and displays an action form with buttons and corresponding actions. 

**Options Object:**

- `title` (string, optional): The title of the form.
- `body` (string, optional): The body text of the form.
- `buttons` (array, required): An array of button objects, each with a `text` property and an optional `texture` property.
- `actions` (array, required): An array of functions corresponding to the actions to be taken when each button is pressed.

**Example Usage:**

```js
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

Forms.ActionForm(player, options);
```
***

### ModalForm

The `ModalForm` method creates and displays a modal form with various interactables including text fields, sliders, toggles, and dropdowns.

**Options Object:**

- `title` (string, optional): The title of the form.
- `interactables` (array, required): An array of interactable objects specifying the type and properties of each interactable.
- `actions` (array, required): An array of functions corresponding to the actions to be taken with the form values.

**Example Usage:**

```js
  const options = {
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
  }

await Forms.ModalForm(player, options);
```
***

### MessageForm

The `MessageForm` method creates and displays a form with buttons that trigger messages.

**Options Object:**

- `title` (string, optional): The title of the form.
- `body` (string, optional): The body text of the form.
- `buttons` (array, required): An array of button objects, each with a `text` property.
- `actions` (array, required): An array of functions to be executed when each button is pressed.

**Example Usage:**

```js
const options = {
  title: 'test',
  body: 'test',
  buttons: [
    { text: 'button 1' },
    { text: 'button 2' }
  ],
  actions: [
    () => player.sendMessage('Button 1'),
    () => player.sendMessage('Button 2')
  ]
};

Forms.MessageForm(player, options);
```

## Error Handling

- If any button in the `buttons` array is not an object or lacks a `text` property, an error will be thrown.
- If an action corresponding to a button press is not a function, a warning will be logged to the console.

## Requirements

- Ensure you have the `ActionFormData`, `ModalFormData`, and `MessageFormData` APIs available in your environment.
- The player object must be valid and capable of receiving a form.

## Dependencies

None specified. This script assumes you have access to the necessary game APIs and objects.

## Installation

1. Copy the `Forms` class script into your project.
2. Import and use the `Forms` methods as demonstrated in the example usage.

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

- [Link to script](https://github.com/ShadyM00n/advanced-forms/tree/main)

### Completion
- [x] ActionFormData
- [x] ModalFormData
- [x] MessageFormData
