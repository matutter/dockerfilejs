FROM centos7
# this is a comment
ENV key=values \
    key2="values 2"
ONBUILD ADD ["/cert/id_rsa", "~/.ssh/id_rsa"]