# Welcome To The Mouse ODC Repository!

## What is the MouseODC

The mouse ODC is an application to help actively collect meta data from animal studies and experiments through the use of web app forms. It is a rendition of the DNP's OpenDataCapture web application. This current repository contains the code for all forms to be used within the application. 
## Entering the MouseODC

After requesting account to be created with your group admin, you can log in and access the MouseODC  [here](http://mouseodc.douglas.rtss.qc.ca/auth/login). Currently hosted and accessible on the internal douglas network with a public facing application in the works :)

## ODC-Mouse-Forms
A repo containing OpenDataCapture forms for tracking mouse data gathered from experiments within the CoBra Lab

## Form Viewer Website

If you would like to review the most up-to-date forms, visit the Form Viewer Website here: [https://cobralab.github.io/ODC-Mouse-Forms/](https://cobralab.github.io/ODC-Mouse-Forms/)

## Running the Form Viewer Locally

The form viewer contains the most up to date forms for each mouse experiment. The form viewer can be run with the following steps. In order to run the form viewer locally one must have Node installed, which can be installed and managed with [Node Version Manger](https://github.com/nvm-sh/nvm). 

1. Installing and activating pnpm package manager

    Pnpm can be activated after a node version is selected, which is done with the following command
    ```
    nvm install --lts
    ```
    To activate pnpm use the command below
    ```
    corepack enable
    ```
2. Install packages

    ```
    pnpm install
    ```
3. Run Localhost instance with this command

    ```
    pnpm dev
    ```
4. Access the form links on locally hosted web page

    Links to the forms are now accessible on the local webpage, which is hosted on http://localhost:5173/ by default

## Having issues?

If you encounter a bug or problem when using the mouseODC please refer to the following steps

If it's a bug with the system itself (i.e. website crash or error), an issue can be created on the ODC repository website [here](https://github.com/DouglasNeuroInformatics/OpenDataCapture/issues/new?template=bug.yaml)

 - Add the cause of the error in the title section of the issue (ex: Submitting form X crashed website)
 - Add the reason for crash/behavior in the current behavior section
 - Describe what the expected behavior of your problem should be (ex: form X should submit successfully)
 - select browser you used with the dropdown
 - Describe steps you took to encounter the error in the "Steps to reproduce section"


 If it is an issue or suggestion for a MouseODC form, please make an issue for it on the MouseODC repository by clicking this [link](https://github.com/CoBrALab/ODC-Mouse-Forms/issues/new) and doing the following:
 
 - Add the name of form you like to change within the issue title
 - Describe the changes you would to have added to the form in the description section of the issue
 - Click the create button to submit the issue to the repository

## Request Changes to ODC entries

 If you would like to delete or update a previous record or subject within your ODC instance please follow these steps:

 1. Contact your ODC admin
 2. State subject Id or record you would like to have updated or deleted
 3. If you would like the record entry/subject Id to be updated provide what you would like the content to be updated to

 ## Useful links

- [OpenDataCapture Website](https://opendatacapture.org/en/)
- [Upload Data Documentation](https://opendatacapture.org/en/docs/guides/how-to-upload-data/)
- [Form Creation Playground](https://playground.opendatacapture.org/)
- [Form Viewer Page](https://cobralab.github.io/ODC-Mouse-Forms/)

