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
            "label": i18n.get("coloured block")
        },
        {
            "tab": i18n.get("settings"),
            "group": i18n.get("styling"),
            "name": "stylingDescription",
            "type": "description",
            "text": i18n.get("styling description")
        },
        {
            "tab": i18n.get("settings"),
            "group": i18n.get("styling"),
            "name": "tagInline",
            "type": "checkbox",
            "label": i18n.get("name placement")
        },
        {
            "tab": i18n.get("settings"),
            "group": " ",
            "name": "contact",
            "type": "description",
            "text": "Built by <a href=\"http://twitter.com/muanchiou\" target=\"_blank\">@muanchiou</a>, submit issues or contribute on <a href=\"http://github.com/muan/pivotal-tweaker\" target=\"_blank\">GitHub</a>."
        }//,
        // {
        //     "tab": i18n.get("settings"),
        //     "group": i18n.get("beta"),
        //     "name": "requesters",
        //     "type": "checkbox",
        //     "label": i18n.get("requesters")
        // },
        // {
        //     "tab": i18n.get("settings"),
        //     "group": i18n.get("beta"),
        //     "name": "requestersDescription",
        //     "type": "description",
        //     "text": i18n.get("requesters description")
        // }
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
