![movingimage](./assets/00-mi-logo.png)

# Front-end developer challenge

The aim of the implementation is not to complete the assignment (of course this would be great), but rather to find out more about your approach, the ***quality, cleanliness and structure*** of your code, and get to know your personal ***prioritization***. This means that it’s better if send an unfinished app with code you can be proud of, rather than a complete app with lots of messy code.
Mockups in this task are just a design suggestion – you are free to implement any other design as soon as it looks OK and meets the requirements.

### Notes

- The backend can be accessed via http://localhost:3001
- It runs with a package called ***json-server***, and the data comes from the ***db.json*** file
- The JSON structure of the ***db.json*** file is twisted on purpose. Please do not change this original structure. The contents of the file are going to change once the application is running and you start adding, editing or deleting records, but the structure has to remain, so you'll have to find a way to edit the records without losing this structure
- Material-UI was added to the starter template. If you feel more comforable with another UI framework, you can change it. You can add all the styles that you need

## Steps for the challenge
- Clone this repository and complete the tasks below
- Upload your code to a repository of your choosing (GitHub, BitBucket, etc.) and send us the link

## Steps to run the project
- Install dependencies with:

```npm i```

- Run both the frontend and backend with:

```npm start```

## List view
UI Suggestion

![movingimage](./assets/01-landing-page.png)

### Requirements

- The landing page displays a list of videos with the following columns:
    - Video name
    - Author
    - Categories
    - Highest quality format
    - Release Date (Can be random data)
    - Options (Buttons: ```Edit Delete```)
- The table/list can be searched
- **Optional**: The list can be sorted

The "Highest quality format" is a made-up label for the format that has the biggest "size" and the highest "res".
Take a look at the following database entry:

```
"formats": {
    "one": { "res": "1080p", "size": 1000 },
    "two": { "res": "720p", "size": 2000 },
    "three": { "res": "720p", "size": 900 }
},
```

So, to choose the biggest format here, we take the one that has the biggest size (in this case "two"). In cases where there are multiple formats with the same "size", we use the "res" value to decide which one to get (Note: "1080p" is bigger than "720p", "720p" is bigger than "480p" and so on).

With the biggest format selected we then form the label as "format_name res". So for this particular example, the generated label should be "two 720p" (The format name is "two", and its res is "720p").

## Add a video
UI Suggestion

![movingimage](./assets/02-add-video-page.png)

### Requirements

- Clicking on the “Add video” button will take you to a form, which contains the following fields:
    - Video name
    - Video author (```<select>```)
    - Video category (```<select multiple>```)
- A new video can be saved and the user will be returned to the list view
- The new video object should automatically get the following property/value:
```
formats: {
    one: { res: “1080p”, size: 1000 }
}
```
- The process can be canceled and by doing so, the user is redirected to the list view
- ***Optional***: There are basic validations available (e.g.: The "Save" button is only active if all the content is valid)

## Edit a video
UI Suggestion

![movingimage](./assets/03-edit-video-page.png)

### Requirements
- There is an interaction element to edit existing video information
- Clicking on this element will take you to a form view
- All changes can be saved (e.g.: If canceled, the user is returned to the list view)
- ***Optional***: There are basic validations available

## Delete a video
UI Suggestion

![movingimage](./assets/04-delete-video-button.png)

### Requirements
- There is an interaction element to delete an existing video
- ***Optional***: A dialog will appear to confirm the deletion