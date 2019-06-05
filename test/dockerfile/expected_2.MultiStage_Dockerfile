FROM docker.io/alpine:latest AS baselayer
ENV key=values \
    key2="values 2"
ONBUILD ADD ["/cert/id_rsa", "~/.ssh/id_rsa"]
FROM centos7 AS nextstage
ENV key=values \
    key2="values 2"