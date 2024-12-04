# runllm

running runllm on local machine:

- `cd into runllm`
- `npm install`
- `npm start` (frontend)
- on successful start should be able to view frontend on http://localhost:3000

in seperate terminal:
- `cd runllm-backend`
- `npm install`
- `node server.mjs` (backend)
- for successful run should say server is running on http://localhost:5002
- NOTE: you will need to `touch .env` in runllm-backend root and add in `REACT_APP_OPENAI_API_KEY='your_openai_key'` for OpenAI assistant calls to work.

Models used (combined together to make the scene):
Display terminal: https://www.fab.com/listings/e714dc28-e41a-4303-a647-a20e9970bb68
SciFi tablet: https://www.fab.com/listings/f2739319-f1c1-41a7-9af1-556a0ebae55e
SciFi style server: https://www.fab.com/listings/e8b5a6e3-6cfe-4815-8a6c-14f0aef11c53
SciFi Terminal 2: https://www.fab.com/listings/58330d80-5abf-4084-9dbb-2c6a701651fd
SciFi Panel: https://www.fab.com/listings/571fa4d9-f186-4312-874f-9fd43d21dd25
SciFi Desk: https://www.fab.com/listings/db1b0eca-c4aa-422f-8442-014340461e7b
Computer Classroom: https://www.fab.com/listings/cd412cb7-167f-41c6-8cc8-481a73e71950
Hacking Device: https://www.fab.com/listings/d8dabd3d-cdf3-43d7-bf95-fda24982c965
Laptop: https://www.fab.com/listings/941829da-40c6-4dac-b984-bdac471f0fd0