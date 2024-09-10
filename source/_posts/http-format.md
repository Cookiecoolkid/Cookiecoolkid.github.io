---
title: http/1.x format
date: 2024-10-30 13:14:24
tags:
- web
- http

categories:
- web
---

reference: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)

<!--more-->

HTTP messages include request messages and response messages. Both have the same structure, consisting of three parts: the start line, headers, an empty line, and the body.

![httpstructure](httpstructure.png)

### http request message

#### start line

http request message is also called request line，include three parts: http method, request target and protocol version.

- An HTTP method, a verb (like GET, PUT or POST) or a noun (like HEAD or OPTIONS), that describes the action to be performed. 
- The request target, usually a URL, or the absolute path of the protocol, port, and domain are usually characterized by the request context. 
- The HTTP version, which defines the structure of the remaining message, acting as an indicator of the expected version to use for the response.

#### headers
HTTP headers from a request follow the same basic structure of an HTTP header: a case-insensitive string followed by a colon (':') and a value whose structure depends upon the header. The whole header, including the value, is then separated by a CRLF (Carriage Return + Line Feed, "\r\n"), reference: [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-2.2)

Many different headers can appear in requests. They can be divided in several groups:
- General headers
- Request headers
- Representation headers

![httpheader](httpheader.png)

#### body

Not all requests have a body. For example, a GET request must not have a body. However, a POST request must include a body. The body contains the data that the server will process. The body can be of any type, including text, JSON, multimedia, or any other format.

Bodies can be divided into two categories:
- Single-resource bodies: consisting of one single file, defined by the two headers: Content-Type and Content-Length.
- Multiple-resource bodies: consisting of a multipart body, each containing a different bit of information. This is typically associated with HTML Forms.

### http response message

#### start line

http response message is also called status line, include three parts: protocol version, status code and status text.

Example: `HTTP/1.1 404 Not Found.`

#### headers

This is similar to request headers, but with different headers.

![reponseheader](reponseheader.png)

#### body

Bodies can be broadly divided into three categories:

- Single-resource bodies, consisting of a single file of known length, defined by the two headers: Content-Type and Content-Length.
- Single-resource bodies, consisting of a single file of unknown length, encoded by chunks with Transfer-Encoding set to chunked.
- Multiple-resource bodies, consisting of a multipart body, each containing a different section of information. These are relatively rare.