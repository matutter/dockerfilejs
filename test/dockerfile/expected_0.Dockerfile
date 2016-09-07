# this is a comment
FROM centos7
ENV key=values \
    key2="values 2"
ONBUILD ADD ["/cert/id_rsa", "~/.ssh/id_rsa"]