# Tiler Service

The tiler service exposes and API to take 4 images and turn them into a single 4 image grid. 

## Usage

Running this service will expose do two things: 

- Expose the main public endpoint `/create` to be used by consumers to create glimpses.
- Serve created glimpses under a local `/tmp` directory for testing purposes.

### POST `/create`

This endpoint accepts 3 images in base64 format, a url to an additional images, and an event name in order to create a glimps and upload it to the correct location in an Amazon S3 bucket. As a response it returns the public url to that glimps. 

The request should include the following fields in the body:

- **`event_name`**: a `string` used as a namespace in the s3 bucket
- **`story`**: an `array` of objects containing an encoded base64 image of the following shape

      {
      	base64: "data:image/png;base64,..."
      }

- **`brand_image`**:  `string` The url to the fourth image in the glimps.

**Example Request:**

    {
    	event_name: "mangohacks",
    	story: [
    		{ base64: "data:image/png;base64,32fasdg..." },
    		{ base64: "data:image/png;base64,32fasdg..." },
    		{ base64: "data:image/png;base64,32fasdg..." }
    	],
    	brand_image: "https://mangohacks.com/logo.jpg"
    }

**RESPONSE**

The endpoint will either return validation errors if the request was missing any fields with a `400` status or it will return a success response with the url to the created glimps.

**Example Response:**

    STATUS 200 OK:
    {
    	success: true,
    	collage: "https://tilegram.s3.amazonaws.com/speak/1531693275097_brand.jpg"
    }
