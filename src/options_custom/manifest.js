// SAMPLE
this.manifest = {
    "name": "Pivotal Tweaker Ultra",
    "icon": "icon.png",
    "settings": [
        {
            "tab": i18n.get("settings"),
            "group": i18n.get("toggle"),
            "name": "dropdownOn",
            "type": "checkbox",
            "label": i18n.get("show toggle dropdown for every member on my team")
        },
        {
            "tab": i18n.get("settings"),
            "group": i18n.get("toggle"),
            "name": "effectOn",
            "type": "checkbox",
            "label": i18n.get("toggle with sliding effect")
        },
        {
            "tab": i18n.get("settings"),
            "group": i18n.get("toggle"),
            "name": "showUnassigned",
            "type": "checkbox",
            "label": i18n.get("show button for switching unassigned stories")
        },
        {
            "tab": i18n.get("settings"),
            "group": i18n.get("styling"),
            "name": "tagOn",
            "type": "checkbox",
            "label": i18n.get("Colour-coded member tag")
        },
        {
            "tab": i18n.get("settings"),
            "group": i18n.get("styling"),
            "name": "tagInline",
            "type": "checkbox",
            "label": i18n.get("Keep member tags inline")
        },
        {
            "tab": i18n.get("settings"),
            "group": i18n.get("styling"),
            "name": "stylingDescription",
            "type": "description",
            "text": i18n.get("stylingDescription")
        },
        // {
        //     "tab": i18n.get("settings"),
        //     "group": "Your name tag",
        //     "name": "userTextColour",
        //     "type": "radioButtons",
        //     "label": "Text colour",
        //     "options": [
        //         { "value" : "#000", "text" : "Black" },
        //         { "value" : "#fff", "text" : "White" },
        //         { "value" : "#ff0000", "text" : "Red" }
        //     ]
        // },
        // {
        //     "tab": i18n.get("settings"),
        //     "group": "Your name tag",
        //     "name": "userBgColour",
        //     "type": "radioButtons",
        //     "label": "Background colour",
        //     "options": [
        //         { "value" : "#000", "text" : "Black" },
        //         { "value" : "#fff", "text" : "White" },
        //         { "value" : "#ff0000", "text" : "Red" }
        //     ]
        // },
    ],
    "alignment": [
    ]
};
