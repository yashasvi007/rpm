define({ "api": [
  {
    "type": "POST",
    "url": "/createBookingRequest",
    "title": "Confirm Booking Request",
    "name": "createBookingRequest",
    "group": "BookingRequest",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "JSON",
            "optional": false,
            "field": "bookingDetail",
            "description": "<p>details of booking</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"hasConsented\": 1,\n  \"_id\": \"5b7e7d60677d4a0b65a82f42\",\n  \"providerId\": \"5b7a8d3b64a7a063e3122f9d\",\n  \"memberId\": \"5b7a6f1daaf92c61c5d782c3\",\n  \"date\": \"2018-09-22T00:00:00.000Z\",\n  \"time\": 11,\n  \"cityId\": \"5b72b726c13f777fc4cd37b5\",\n  \"documentUrl\": \"\",\n  \"assignedTo\": \"5b7a6d12f77dfc61259b6e8a\",\n  \"statusId\": \"5b7a6299d087675f2841a684\",\n  \"concern\": \"Headache\",\n  \"createdAt\": \"2018-08-23T09:24:48.087Z\",\n  \"updatedAt\": \"2018-08-23T09:24:48.087Z\",\n  \"__v\": 0,\n  \"mailResponse\": {\n      \"ResponseMetadata\": {\n          \"RequestId\": \"61c57876-a6b6-11e8-8ec1-e9d841ca9efd\"\n      },\n      \"MessageId\": \"010201656619c2b6-18c0b3e1-26db-4717-bdd4-6e80795a5e69-000000\"\n  }\n}",
          "type": "type"
        }
      ]
    },
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"providerId\":\"5b7a8d3b64a7a063e3122f9d\",\n  \"memberId\":\"5b7a6f1daaf92c61c5d782c3\",\n  \"date\":\"2018-09-22\",\n  \"time\":11,\n  \"cityId\":\"5b72b726c13f777fc4cd37b5\",\n  \"hasConsented\":1,\n  \"documentUrl\":\"\",\n  \"assignedTo\":\"5b7a6d12f77dfc61259b6e8a\",\n  \"statusId\":\"5b7a6299d087675f2841a684\",\n  \"concern\":\"Headache\"\n}",
          "type": "type"
        }
      ]
    },
    "filename": "app/controllers/bookingRequest.controller.js",
    "groupTitle": "BookingRequest"
  },
  {
    "type": "GET",
    "url": "/getAllBookingRequests",
    "title": "Get all booking requests",
    "name": "getAllBookingRequests",
    "group": "BookingRequest",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Array",
            "optional": false,
            "field": "bookingRequests",
            "description": "<p>array of booking Requests</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": " [\n  {\n      \"hasConsented\": 0,\n      \"_id\": \"5b7ba9f805d804730a34557a\",\n      \"providerId\": \"5b7a8d3b64a7a063e3122f9d\",\n      \"memberId\": \"5b7a6f1daaf92c61c5d782c3\",\n      \"date\": \"2018-08-21T00:00:00.000Z\",\n      \"time\": 10,\n      \"cityId\": \"5b72b726c13f777fc4cd37b5\",\n      \"documentUrl\": \"\",\n      \"assignedTo\": \"5b7a6d12f77dfc61259b6e8a\",\n      \"statusId\": \"5b7a6299d087675f2841a684\",\n      \"concern\": \"Headache\",\n      \"createdAt\": \"2018-08-21T05:58:16.071Z\",\n      \"updatedAt\": \"2018-08-21T05:58:16.071Z\",\n      \"__v\": 0\n  },\n  {\n      \"hasConsented\": 0,\n      \"_id\": \"5b7be33df309d37b1b1a2150\",\n      \"providerId\": \"5b7a8d3b64a7a063e3122f9d\",\n      \"memberId\": \"5b7a6f1daaf92c61c5d782c3\",\n      \"date\": \"2018-08-20T07:41:29.371Z\",\n      \"time\": 10,\n      \"cityId\": \"5b72b726c13f777fc4cd37b5\",\n      \"documentUrl\": \"\",\n      \"assignedTo\": \"5b7a6d12f77dfc61259b6e8a\",\n      \"statusId\": \"5b7a6299d087675f2841a684\",\n      \"concern\": \"Headache\",\n      \"createdAt\": \"2018-08-21T10:02:37.188Z\",\n      \"updatedAt\": \"2018-08-21T10:02:37.188Z\",\n      \"__v\": 0\n  }\n]",
          "type": "type"
        }
      ]
    },
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \n}",
          "type": "type"
        }
      ]
    },
    "filename": "app/controllers/bookingRequest.controller.js",
    "groupTitle": "BookingRequest"
  },
  {
    "type": "GET",
    "url": "/getCitiesByCountry/:id",
    "title": "Get all Cities Filtered By CountryID",
    "name": "getCitiesByCountry",
    "group": "Cities",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "countryId",
            "description": "<p>CountryId</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "/getCitiesByCountry/5c2bc658b7bd7a01a31410bf",
          "type": "url"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "cities",
            "description": "<p>returns an array of cities</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n\t\"_id\" : ObjectId(\"5c2bc658b7bd7a01a31410bf\"),\n\t\"cities\" : [\n\t\t\"Bulawayo\",\n\t\t\"Chinhoyi\",\n\t\t\"Greendale\",\n\t\t\"Gwanda\",\n\t\t\"Harare\",\n\t\t\"Kwekwe\",\n\t\t\"Mufakose\",\n\t\t\"Mutare\",\n\t\t\"Victoria Falls\"\n\t],\n\t\"name\" : \"Zimbabwe\",\n\t\"createdAt\" : ISODate(\"2019-01-01T19:58:16.650Z\"),\n\t\"updatedAt\" : ISODate(\"2019-01-01T19:58:16.650Z\")\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/city.controller.js",
    "groupTitle": "Cities"
  },
  {
    "type": "GET",
    "url": "/getCountries",
    "title": "Get country list",
    "name": "getCountries",
    "group": "Countries",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "countries",
            "description": "<p>Countries data mapped with their Ids</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"status\": true,\n    \"statusCode\": 200,\n    \"payload\": {\n        \"data\": {\n            \"country\": {\n                \"5c2bc658b7bd7a01a3141028\": {\n                    \"_id\": \"5c2bc658b7bd7a01a3141028\",\n                    \"name\": \"Afghanistan\"\n                },\n                \"5c2bc658b7bd7a01a3141029\": {\n                    \"_id\": \"5c2bc658b7bd7a01a3141029\",\n                    \"name\": \"Albania\"\n                },\n                \"5c2bc658b7bd7a01a314102a\": {\n                    \"_id\": \"5c2bc658b7bd7a01a314102a\",\n                    \"name\": \"Algeria\"\n                },\n                ...\n                ...\n                ...\n                \"5c2bc658b7bd7a01a31410be\": {\n                    \"_id\": \"5c2bc658b7bd7a01a31410be\",\n                    \"name\": \"Zambia\"\n                },\n                \"5c2bc658b7bd7a01a31410bf\": {\n                    \"_id\": \"5c2bc658b7bd7a01a31410bf\",\n                    \"name\": \"Zimbabwe\"\n                }\n            }\n        },\n        \"message\": \"List of countries\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/country.controller.js",
    "groupTitle": "Countries"
  },
  {
    "type": "POST",
    "url": "/invite",
    "title": "Creates a invitation event",
    "name": "invite",
    "group": "Events",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Status of the event</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"status\": true,\n   \"statusCode\": 200,\n   \"payload\": {\n       \"data\": {\n          \"status\": \"pending\",\n          \"_id\": \"5c011e2d2217692a513134cc\"\n       },\n       \"message\": \"Invite sent.\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "ContactObject",
            "optional": true,
            "field": "contactNo",
            "description": "<p>Contact details of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contactNo.countryCode",
            "description": "<p>Country Code of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contactNo.phoneNumber",
            "description": "<p>Phone number of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userCategory",
            "description": "<p>Category of the invitee</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId[]",
            "optional": true,
            "field": "programId",
            "description": "<p>Id of the program</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Name of the invitee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "organizationName",
            "description": "<p>Name of the organization of the invitee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "speciality",
            "description": "<p>Speciality of the invitee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "licenseNumber",
            "description": "<p>License number of the invitee</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"email\": \"maxlife@email.com\",\n \"contactNo\": {\n   \"countryCode\": \"+91\",\n   \"phoneNumber\": 9122110019\n },\n \"userCategory\": \"doctor\",\n \"programId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INVITE_NOT_SENT\",\n          \"message\": \"Your invite was not sent.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/event/event.controller.js",
    "groupTitle": "Events"
  },
  {
    "type": "POST",
    "url": "/validate",
    "title": "Validates provided link",
    "name": "validateLink",
    "group": "Events",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Validation",
            "description": "<p>Validation along with email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"status\": true,\n    \"statusCode\": 200,\n    \"payload\": {\n       \"data\": {\n            \"email\": \"nikhil.prabhakar@tripock.com\"\n            \"category\": \"doctor\"\n        },\n       \"message\": \"Your link is valid.\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "link",
            "description": "<p>Unique key sent to the user in link.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"link\": \"e716c149-761a-4250-b5d1-b5ea55e35774\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Already-Used-Link-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 403,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"LINK_ALREADY_USED\",\n          \"message\": \"Your link has been used. Same link can't be used twice.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Expired-Link-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 410,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"EVENT_EXPIRED\",\n          \"message\": \"Your invite link has expired.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Cancelled-Event-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 403,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"EVENT_WAS_CANCELLED\",\n          \"message\": \"Your had cancelled your invite previously, so it no longer exists. You may ask for a new invite.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Invalid-Link-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INVALID_LINK\",\n          \"message\": \"Your link is invalid.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Invalid-OR-Expired-Token-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/event/event.controller.js",
    "groupTitle": "Events"
  },
  {
    "type": "POST",
    "url": "/add-program",
    "title": "Adds Program",
    "name": "addProgram",
    "group": "Program",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Your Program is created.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the program.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pharmaCo",
            "description": "<p>Name of the pharma company associated with the program.</p>"
          },
          {
            "group": "Parameter",
            "type": "targetLocationObject",
            "optional": false,
            "field": "targetLocation",
            "description": "<p>Location at which program will be initiated.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "targetLocation.city",
            "description": "<p>City at which program will be initiated.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "targetLocation.country",
            "description": "<p>Country at which program will be initiated.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the program.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "activeFrom",
            "description": "<p>Starting date of the program.</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "expiresOn",
            "description": "<p>Ending date of the program.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "accessLevel",
            "description": "<p>Defines who can access the program.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId[]",
            "optional": false,
            "field": "products",
            "description": "<p>List of products involved in the program.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId[]",
            "optional": false,
            "field": "doctors",
            "description": "<p>List of doctors involved in the program.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId[]",
            "optional": false,
            "field": "careCoaches",
            "description": "<p>List of care coaches involved in the program.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\t\"name\": \"Pakinson's effect on bones\",\n   \"pharmaCo\": \"Mega Labs\",\n   \"targetLocation\": {\n   \t\"city\": \"Dubai\",\n   \t\"country\": \"UAE\"\n   },\n   \"description\": \"Default program\",\n   \"activeFrom\": \"2019-1-1\",\n   \"expiresOn\": \"2021-12-31\",\n   \"products\": [\"5c0e238542e17a008c32008b\", \"5c0e238542e17a008c32008b\"],\n   \"accessLevel\": 1,\n   \"doctors\": [\"5c0e238542e17a008c32008b\"],\n   \"careCoaches\": [\"5c0e238542e17a008c32008c\"]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Cookies-Not-Set-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Can't process your request, cookies are not set. Please sign in again.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized-Program-Creation-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n           \"status\": \"PROGRAM_ADDITION_NOT_PERMISSIBLE\",\n           \"message\": \"You are not authorized to add a program.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please sign in and try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/program/program.controller.js",
    "groupTitle": "Program"
  },
  {
    "type": "POST",
    "url": "/add-to-program",
    "title": "Adds to Program",
    "name": "addToProgram",
    "group": "Program",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Products added\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "programId",
            "description": "<p>Program in which additions are to be made.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "additionType",
            "description": "<p>Type of the object to be added (doctor, careCoach, product).</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId[]",
            "optional": false,
            "field": "addedObjects",
            "description": "<p>List of objects to be added in the program.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\t \"programId\":\"5c14a70ba3cb9300b32161d4\",\n\t \"additionType\": \"product\",\n\t \"addedObjects\": [\"5c0e238542e17a008c32008b\", \"5c0e238542e17a008c32008c\"]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Cookies-Not-Set-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Can't process your request, cookies are not set. Please sign in again.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized-Program-Creation-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n           \"status\": \"PROGRAM_ADDITION_NOT_PERMISSIBLE\",\n           \"message\": \"You are not authorized to add to this program.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please sign in and try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/program/program.controller.js",
    "groupTitle": "Program"
  },
  {
    "type": "OPTIONS",
    "url": "/getResponse",
    "title": "Generates response",
    "name": "getResponse",
    "group": "Response",
    "description": "<p>Description of getResponse function. This function, based on the status, builds the response body. The path /getResponse does not exists. It's just because of apidoc's structure.</p>",
    "version": "0.0.0",
    "filename": "app/helper/responseFormat.js",
    "groupTitle": "Response"
  },
  {
    "type": "OPTIONS",
    "url": "/response",
    "title": "Response format",
    "name": "responseFormat",
    "group": "Response",
    "version": "1.0.0",
    "description": "<p>Description of ResponseFormat This class is a standard response format which gives successful response in the format. The path /response does not exists. It's just because of apidoc's structure.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n \"status\": true,\n \"statusCode\": 200,\n \"payload\": {\n   \"data\": {\n     \"somekey\": \"somevalue\"\n   },\n   \"message\": \"This is a successful response.\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n \"status\": false,\n \"statusCode\": 404,\n \"payload\": {\n   \"error\": {\n     \"status\": \"NOT_FOUND\",\n     \"message\": \"This is a unsuccessful response.\"\n   }\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/helper/responseFormat.js",
    "groupTitle": "Response"
  },
  {
    "type": "OPTIONS",
    "url": "/setData",
    "title": "Sets data field",
    "name": "setData",
    "group": "Response",
    "description": "<p>Description of setData function. This function takes variable arguments. Bases on the no of arguments it populates the data field. If no of arguments is 1(one), it assumes that the argument is a object and copies to the data. If the no of arguments is 2(two), it assumes that the arguments are key value pairs and populates the data accordingly. The path /setData does not exists. It's just because of apidoc's structure.</p>",
    "version": "0.0.0",
    "filename": "app/helper/responseFormat.js",
    "groupTitle": "Response"
  },
  {
    "type": "POST",
    "url": "/accept-invite",
    "title": "Accept Invite",
    "name": "acceptInvite",
    "group": "Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "link",
            "description": "<p>Unique key sent to the user in link.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"link\": \"feadcde2-56a8-4b2b-87d2-f9ac42a22351\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "301": [
          {
            "group": "301",
            "type": "none",
            "optional": false,
            "field": "Redirection",
            "description": "<p>Redirects to Sign-in</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Invalid-Link-Response:",
          "content": "{\n    \"status\": false,\n    \"statusCode\": 422,\n    \"payload\": {\n        \"error\": {\n            \"link\": {\n                \"location\": \"body\",\n                 \"param\": \"link\",\n                 \"value\": \"fb0df9f4-595d-4d96-84cb-c77a72766ea\",\n                 \"msg\": \"Invalid value\"\n            }\n        }\n    }\n}",
          "type": "json"
        },
        {
          "title": "Contact-Already-Exists-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 400,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"CONTACT_ALREADY_EXISTS\",\n          \"message\": \"Please try another number. As this number already exists in our systems\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Link-Doesn't-Exists-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 400,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INVALID_LINK\",\n\t\t\t     \"message\": \"Provided link doens't exists in our system.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/assign-to-patient",
    "title": "Assign CareCoach to Patients",
    "name": "assignCareCoachToPatient",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Care Coach assigned to the patient.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "patient",
            "description": "<p>Object Id of patients.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "careCoach",
            "description": "<p>Object Id of careCoach.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"careCoach\": \"5c0f5c68ed4800085154f122\"\n   \"patient\": \"5c0f5c68ed4800085174f343\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Cookies-not-set-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Can't process your request, cookies are not set. Please sign in again.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please sign in and try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/assign-to-carecoach",
    "title": "Assign Patients to CareCoaches",
    "name": "assignPatientsToCareCoach",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Patients assigned to the care coach.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId[]",
            "optional": false,
            "field": "patients",
            "description": "<p>Object Ids of patients.</p>"
          },
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "careCoach",
            "description": "<p>Object Id of careCoach.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"careCoach\": \"5c0f5c68ed4800085154f122\"\n   \"patients\": [\"5c0f5c68ed4800085174f343\", \"5c0f5c68ed4800085174f344\"]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Cookies-not-set-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Can't process your request, cookies are not set. Please sign in again.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please sign in and try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/change-forgotten-password",
    "title": "Changes password after email verification",
    "name": "changeForgottenPassword",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Password Updated.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password given by the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirmPassword",
            "description": "<p>ConfirmPassword given by the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "link",
            "description": "<p>Unique key sent to the user in link.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"password\": \"password\",\n   \"confirmPassword\": \"password\",\n   \"link\": \"2d0f78f7-9818-4ce2-9903-8c4aeb97b4c3\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Password-Mismatch-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"PASSWORD_MISMATCH\",\n          \"message\": \"Password and Confirm password do not match.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/change-password",
    "title": "Changes password",
    "name": "changePassword",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Password Updated.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "currentPassword",
            "description": "<p>User's current password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>Password given by the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirmPassword",
            "description": "<p>ConfirmPassword given by the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"currentPassword\": \"password\",\n   \"newPassword\": \"qwerty\",\n   \"confirmPassword\": \"qwerty\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Password-Mismatch-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n           \"newPassword\": {\n               \"location\": \"body\",\n               \"param\": \"newPassword\",\n               \"value\": \"qwertya\",\n               \"msg\": \"Passwords do not match\"\n           }\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized-Access-Response(Incorrect Current Password):",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"UNAUTHORIZED_ACCESS\",\n          \"message\": \"Wrong current password. Please try again with correct password.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/edit-profile",
    "title": "Edits Profile",
    "name": "editProfile",
    "group": "Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of birth of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gender",
            "description": "<p>Gender of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "ContactObject",
            "optional": true,
            "field": "contactNo",
            "description": "<p>Contact number of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contactNo.countryCode",
            "description": "<p>Country code of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contactNo.phoneNumber",
            "description": "<p>Phone number of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "HomeAddressObject",
            "optional": false,
            "field": "homeAddress",
            "description": "<p>Address of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "homeAddress.addressLine1",
            "description": "<p>Line 1 of address of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "homeAddress.zipCode",
            "description": "<p>Zip Code of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "homeAddress.city",
            "description": "<p>City of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "homeAddress.country",
            "description": "<p>Country of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "ContactsObject",
            "optional": false,
            "field": "contacts",
            "description": "<p>Contacts of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "RelativesObject",
            "optional": false,
            "field": "contacts.relatives",
            "description": "<p>Information about the relatives of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contacts.relatives.name",
            "description": "<p>Name of the relative of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "ContactObject",
            "optional": false,
            "field": "contacts.relatives.contactNo",
            "description": "<p>Contact number of the  user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contacts.relatives.contactNo.countryCode",
            "description": "<p>Country code of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contacts.relatives.contactNo.phoneNumber",
            "description": "<p>Phone number of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "WorkObject",
            "optional": true,
            "field": "work",
            "description": "<p>Work info of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "work.organizationName",
            "description": "<p>Organization name of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "work.licenseNumber",
            "description": "<p>License number of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "work.speciality",
            "description": "<p>Speciality of the user(Only for doctor).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "work.about",
            "description": "<p>Work info of the user(Only for doctor).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "work.services",
            "description": "<p>Services the user can provide(Only for careCoaches).</p>"
          },
          {
            "group": "Parameter",
            "type": "OfficeAddressObject",
            "optional": true,
            "field": "work.officeAddress",
            "description": "<p>Office Address of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "work.officeAddress.addressLine1",
            "description": "<p>Line 1 of office address of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "work.officeAddress.zipCode",
            "description": "<p>Zip code of office of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "work.officeAddress.city",
            "description": "<p>City of office of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "work.officeAddress.country",
            "description": "<p>Country of office of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "SettingsObject",
            "optional": true,
            "field": "settings",
            "description": "<p>Settings of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "PreferencesObject",
            "optional": false,
            "field": "settings.preferences",
            "description": "<p>Preferences of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "NotificationsObject",
            "optional": false,
            "field": "settings.preferences.notifications",
            "description": "<p>Notifications settings of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "settings.preferences.notifications.smsAlerts",
            "description": "<p>Preference of user for sms alerts.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "settings.preferences.notifications.pushAlerts",
            "description": "<p>Preference of user for push alerts.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "settings.preferences.notifications.emailAlerts",
            "description": "<p>Preference of user for email alerts.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "settings.preferences.notifications.reminderAlerts",
            "description": "<p>Preference of user for reminder alerts.</p>"
          },
          {
            "group": "Parameter",
            "type": "MedicalConditionObject",
            "optional": false,
            "field": "medicalCondition",
            "description": "<p>Medical condition of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "BasicConditionObject",
            "optional": false,
            "field": "medicalCondition.basicCondition",
            "description": "<p>Basic medical condition of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicalCondition.basicCondition.chiefComplaint",
            "description": "<p>Chief medical complaint of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicalCondition.basicCondition.allergies",
            "description": "<p>Allergies of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicalCondition.basicCondition.surgeriesOrFracture",
            "description": "<p>Past surgeries or fractures of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicalCondition.basicCondition.others",
            "description": "<p>Any other medical detials about the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "VitalsObject",
            "optional": false,
            "field": "medicalCondition.vitals",
            "description": "<p>Vitals of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicalCondition.vitals.temperatureUnit",
            "description": "<p>Temperature Unit for the temperature of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "medicalCondition.vitals.temperature",
            "description": "<p>Temperature of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "medicalCondition.vitals.respirationRate",
            "description": "<p>Respiration rate of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "medicalCondition.vitals.pulse",
            "description": "<p>Pulse rate of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "medicalCondition.vitals.bloodPressure",
            "description": "<p>Blood pressure of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "ClinicalReadingsObject",
            "optional": false,
            "field": "clinicalReadings",
            "description": "<p>Clinical readings of the user(Only for patient).</p>"
          },
          {
            "group": "Parameter",
            "type": "ServicesObject",
            "optional": false,
            "field": "services",
            "description": "<p>Services provided by the user(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.medicalServices",
            "description": "<p>Does user provide medical services(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "HomeHealthCareObject",
            "optional": false,
            "field": "services.homeHealthCare",
            "description": "<p>Home health care services provided by the user(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.homeHealthCare.nursing",
            "description": "<p>Does user provides nursing services(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.homeHealthCare.physicalTherapy",
            "description": "<p>Does user provides physical therapies(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.homeHealthCare.occupationalTherapy",
            "description": "<p>Does user provides occupational therapies(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.homeHealthCare.speechPathology",
            "description": "<p>Does user provides speech pathology services(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.homeHealthCare.medicalCounselling",
            "description": "<p>Does user provides medical Counselling(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.homeHealthCare.healthAide",
            "description": "<p>Does user provides health aide(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "SpecialCareObject",
            "optional": false,
            "field": "services.specialCare",
            "description": "<p>Special cares provided by the user(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.specialCare.cardiacCare",
            "description": "<p>Does user provides cardiac care(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.specialCare.diabetesCare",
            "description": "<p>Does user provides diabetes care(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "services.specialCare.smokingCessation",
            "description": "<p>Does user helps in smoking cessation(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "NonMedicalServicesObject",
            "optional": false,
            "field": "services.nonMedicalServices",
            "description": "<p>Non medical services provided by the user(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "services.nonMedicalServices.respiteCare",
            "description": "<p>Does user provides respite care services(Only for careCoach).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "services.nonMedicalServices.homemaking",
            "description": "<p>Does user provides homemaking services.(Only for careCoach).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\t\"name\": \"Stan lee\",\n\t\"gender\": \"M\",\n\t\"dob\": \"1953-11-19\",\n\t\"homeAddress\": {\n\t\t\"addressLine1\": \"House 4\",\n\t\t\"addressLine2\": \"Marvel St.\",\n\t\t\"zipCode\": \"52002\",\n\t\t\"city\": \"LA\",\n\t\t\"country\": \"US\"\n\t},\n\t\"settings\": {\n   \t\"preferences\": {\n       \t\"notifications\": {\n       \t\"smsAlerts\": true,\n       \t\"emailAlerts\": false,\n       \t\"pushAlerts\": true,\n       \t\"reminderAlerts\": true\n       \t}\n   \t }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Profile saved.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Validation-Error-Response",
          "content": "{\n    \"status\": false,\n    \"statusCode\": 422,\n    \"payload\": {\n        \"error\": {\n            \"name\": {\n                \"location\": \"body\",\n                \"param\": \"name\",\n                \"msg\": \"Invalid value\"\n            },\n            \"homeAddress.country\": {\n                \"location\": \"body\",\n                \"param\": \"homeAddress.country\",\n                \"msg\": \"Invalid value\"\n            }\n        }\n    }\n}",
          "type": "json"
        },
        {
          "title": "Contacts-Already-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 400,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"CONTACT_ALREADY_EXISTS\",\n          \"message\": \"Please try another number. As this number already exists in our systems\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "No-Cookies-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Can't update your profile now, cookies are not set. Please sign in again.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong while saving your profile. Please login and try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/forgot-password",
    "title": "Sends verification mail",
    "name": "forgotPassword",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Mail has been sent.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"email\": \"nikhil.prabhakar@tripock.com\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Validation-Error-Response",
          "content": "{\n    \"status\": false,\n    \"statusCode\": 422,\n    \"payload\": {\n        \"error\": {\n            \"email\": {\n                \"location\": \"body\",\n                \"param\": \"email\",\n                \"value\": \"nikhiltripock.com\"\n                \"msg\": \"Invalid value\"\n            }\n        }\n    }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "GET",
    "url": "/myprofile",
    "title": "Show profile",
    "name": "getProfile",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n{\n    \"status\": true,\n    \"statusCode\": 200,\n    \"payload\": {\n        \"data\": {\n            \"users\": {\n                \"5c2bc653a80f9301986428af\": {\n                    \"basicInfo\": {\n                        \"_id\": \"5c2bc653a80f9301986428af\",\n                        \"name\": \"Ant Man\",\n                        \"category\": \"doctor\"\n                    },\n                    \"work\": {\n                        \"about\": null,\n                        \"licenseNumber\": null,\n                        \"officeAddress\": {\n                            \"addressLine1\": null,\n                            \"addressLine2\": null,\n                            \"city\": \"Delhi\",\n                            \"country\": null,\n                            \"zipCode\": 122002\n                        },\n                        \"organizationName\": \"hospital\",\n                        \"speciality\": \"ENT\"\n                    },\n                   \"settings\": {\n                        \"preferences\": {\n                            \"notifications\": {\n                                \"smsAlerts\": false,\n                                \"emailAlerts\": true,\n                                \"pushAlerts\": false,\n                                \"reminderAlerts\": true\n                           }\n                        },\n                        \"isCalendarSynced\": false,\n                        \"isProfileCompleted\": true\n                    },\n                   \"personalInfo\": {\n                        \"contactNo\": {\n                            \"countryCode\": \"+91\",\n                            \"phoneNumber\": \"12345678\",\n                            \"verified\": false\n                        },\n                       \"homeAddress\": {\n                            \"addressLine1\": \"554/1102\",\n                            \"addressLine2\": \"Suajnpura, Alambagh\",\n                            \"city\": \"Lucknow\",\n                            \"country\": null,\n                            \"zipCode\": 2226005\n                        },\n                        \"email\": \"doctor@rpm.com\"\n                     }\n                },\n                \"5c2bc653a80f9301986428b1\": {\n                   \"_id\": \"5c2bc653a80f9301986428b1\",\n                    \"profilePicLink\": \"dbb9/17bdc90b3247b4f1cb5061395efc.png\",\n                    \"category\": \"patient\"\n                },\n                \"5c2c8c4e4af90c064a736eda\": {\n                    \"_id\": \"5c2c8c4e4af90c064a736eda\",\n                   \"name\": \"Stan Lee\",\n                    \"category\": \"patient\"\n                }\n            },\n            \"programs\": {}\n        },\n       \"message\": \"User Data\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "No-Cookies-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Can't update your profile now, cookies are not set. Please sign in again.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong while saving your profile. Please login and try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "GET",
    "url": "/get-basic-info",
    "title": "Gets basic info",
    "name": "onAppStart",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "BasicInfo",
            "description": "<p>Basic info about the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n     \"data\": {\n         \"basicInfo\": {\n            \"_id\": \"5c2bc653a80f9301986428af\",\n            \"name\": \"Nikhil Prabhakar\",\n            \"category\": \"doctor\",\n            \"homeAddress\": {\n                \"addressLine1\": \"H no 1\",\n                \"addressLine2\": \"Area 1\",\n                \"city\": \"Lucknow\",\n                \"country\": null,\n                \"zipCode\": 226001\n                }\n           }\n       },\n       \"message\": \"Basic info\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Password-Mismatch-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n           \"newPassword\": {\n               \"location\": \"body\",\n               \"param\": \"newPassword\",\n               \"value\": \"qwertya\",\n               \"msg\": \"Passwords do not match\"\n           }\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized-Access-Response(Incorrect Current Password):",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"UNAUTHORIZED_ACCESS\",\n          \"message\": \"Wrong current password. Please try again with correct password.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/send-otp",
    "title": "Sends an otp to the user",
    "name": "sendOTP",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"OTP sent.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ContactObject",
            "optional": false,
            "field": "contactNo",
            "description": "<p>Contact details of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contactNo.countryCode",
            "description": "<p>Country Code of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "contactNo.phoneNumber",
            "description": "<p>Phone number of the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"contactNo\": {\n       \"countryCode\": \"+91\",\n       \"phoneNumber\": 9988776655\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Cookies-Not-Set-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Can't send OTP now, cookies are not set. Please sign in again.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Contact-Already-Exists-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"CONTACT_ALREADY_EXISTS\",\n          \"message\": \"This number already exists. Please try again with another number.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/sign-in",
    "title": "Sign-in",
    "name": "signIn",
    "group": "Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user which was invited.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password against the given email.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"email\": \"iamsuper@admin.com\",\n \"password\": \"password\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n     \"data\": {\n           isCalendarSynced: true,\n           isProfileCompleted: false\n     },\n     \"message\": \"Sign in successful!\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Invalid-Email-Response:",
          "content": "{\n    \"status\": false,\n    \"statusCode\": 422,\n    \"payload\": {\n        \"error\": {\n            \"email\": {\n                \"location\": \"body\",\n                \"param\": \"email\",\n                \"value\": \"iamsupemin.com\",\n                \"msg\": \"email is not valid\"\n           }\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Invalid-Password-Length-Response:",
          "content": "{\n    \"status\": false,\n    \"statusCode\": 422,\n    \"payload\": {\n        \"error\": {\n            \"password\": {\n                \"location\": \"body\n                \"param\": \"password\",\n                \"value\": \"pas\",\n                \"msg\": \"Invalid value\"\n           }\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Email-Password-Mismatch-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"UNAUTHORIZED_ACCESS\",\n          \"message\": \"Either Username or Password is not correct.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Internal Server Error!\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "Post",
    "url": "/sign-out",
    "title": "Sign-out",
    "name": "signOut",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n \"status\": true,\n \"statusCode\": 200,\n \"payload\": {\n   \"data\": {},\n   \"message\": \"Sign out successfully!\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Can't sign you out for now.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/sign-up",
    "title": "Sign-up",
    "name": "signUp",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n \"status\": true,\n \"statusCode\": 200,\n \"payload\": {\n   \"data\": {},\n   \"message\": \"Sign up successful!\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Given password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirmPassword",
            "description": "<p>Given confirmPassword.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "link",
            "description": "<p>Unique key sent to the user in link.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"password\": \"mypassword\",\n \"confirmPassword\": \"mypassword\",\n \"link\": \"feadcde2-56a8-4b2b-87d2-f9ac42a22351\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Password-Mismatch-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n           \"password\": {\n               \"location\": \"body\",\n               \"param\": \"password\",\n               \"value\": \"passwor\",\n               \"msg\": \"Passwords do not match\"\n           }\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Invalid-Link-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 422,\n   \"payload\": {\n       \"error\": {\n           \"link\": {\n               \"location\": \"body\",\n               \"param\": \"link\",\n               \"value\": \"fb0df9f4-595d-4d96-84cb-c77a72766ea\",\n               \"msg\": \"Invalid value\"\n           }\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"UNSUCCESSFUL\",\n          \"message\": \"There was some error in signing you up. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/upload-profile-pic",
    "title": "Uploads profile pic",
    "name": "uploadProfilePic",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Link of the uploaded image</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {\n        \"pic_url\": \"http://localhost:9001/rpm/2431/4387534059879842\"\n     },\n    \"message\": \"Profile picture saved\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "FormData",
            "optional": false,
            "field": "profile-pic",
            "description": "<p>Multipart form data(Image).</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Cookies-Not-Set-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 401,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Cant' verify the otp. Cookies are not set.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Minio-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"IMAGE_NOT_SAVED\",\n          \"message\": \"There was some problem in saving your picture. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  },
  {
    "type": "POST",
    "url": "/verify-otp",
    "title": "Verifies the otp",
    "name": "verifyOTP",
    "group": "Users",
    "version": "1.0.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "Status",
            "description": "<p>Success status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": true,\n  \"statusCode\": 200,\n  \"payload\": {\n    \"data\": {},\n    \"message\": \"Phone verified.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "otp",
            "description": "<p>OTP sent to the user's number.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"otp\": 1457\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Cookies-Not-Set-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 403,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"COOKIES_NOT_SET\",\n          \"message\": \"Cant' verify the otp. Cookies are not set.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "OTP-mismatch-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 400,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"OTP_MISMATCH\",\n          \"message\": \"Given otp is wrong.\"\n       }\n   }\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "{\n   \"status\": false,\n   \"statusCode\": 500,\n   \"payload\": {\n       \"error\": {\n          \"status\": \"INTERNAL_SERVER_ERROR\",\n          \"message\": \"Something went wrong. Please try again.\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/user/user.controller.js",
    "groupTitle": "Users"
  }
] });
