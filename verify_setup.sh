#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "1. Registering Employer..."
EMPLOYER_RES=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"company_one","password":"password123","role":"POSTER"}' $BASE_URL/register)
echo "Response: $EMPLOYER_RES"
EMPLOYER_ID=$(echo $EMPLOYER_RES | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Employer ID: $EMPLOYER_ID"

echo -e "\n2. Registering Job Seeker..."
SEEKER_RES=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"seeker_one","password":"password123","role":"SEEKER"}' $BASE_URL/register)
echo "Response: $SEEKER_RES"
SEEKER_ID=$(echo $SEEKER_RES | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Seeker ID: $SEEKER_ID"

if [ -z "$EMPLOYER_ID" ] || [ -z "$SEEKER_ID" ]; then
    echo "Failed to register users. Exiting."
    exit 1
fi

echo -e "\n3. Posting a Job..."
JOB_RES=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"posterId\":$EMPLOYER_ID,\"title\":\"Senior Dev\",\"company\":\"Tech Corp\",\"location\":\"Remote\",\"description\":\"Great job\",\"salary\":\"150k\"}" $BASE_URL/jobs)
echo "Response: $JOB_RES"
JOB_ID=$(echo $JOB_RES | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Job ID: $JOB_ID"

if [ -z "$JOB_ID" ]; then
    echo "Failed to post job. Exiting."
    exit 1
fi

echo -e "\n4. Listing Jobs..."
curl -s $BASE_URL/jobs | grep "Senior Dev" && echo "Job listed successfully" || echo "Job not found"

echo -e "\n5. Applying for Job..."
curl -s -X POST -H "Content-Type: application/json" -d "{\"jobId\":$JOB_ID,\"seekerId\":$SEEKER_ID}" $BASE_URL/apply
echo ""

echo -e "\n6. Checking Applications (Seeker side)..."
curl -s "$BASE_URL/my-applications?seekerId=$SEEKER_ID"
echo ""

echo -e "\n7. Checking Applicants (Employer side)..."
curl -s "$BASE_URL/jobs/$JOB_ID/applicants"
echo ""

echo -e "\n8. Checking Frontend Availability..."
curl -I http://localhost:5173
