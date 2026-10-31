EXP_06 - CI/CD pipeline for an ML app (Git + Jenkins + Docker)
Run locally (no Docker):
  pip install -r requirements.txt   (use pip3 / python3 on Mac)
  pytest                            -> runs the test
  python app.py                     -> open http://localhost:5000
Run with Docker:
  docker build -t ml-ticket-app .
  docker run -p 5002:5000 ml-ticket-app    -> open http://localhost:5002
Jenkins: New Item -> Pipeline -> "Pipeline script from SCM" -> your GitHub repo URL
         -> Script Path: EXP_06/Jenkinsfile
