#!/bin/bash
for i in "$@"
do
        case $i in
            -f=*|--firstname=*)
            FIRSTNAME="${i#*=}"
            shift # past argument=value
            ;;
            -l=*|--lastname=*)
            LASTNAME="${i#*=}"
            shift # past argument=value
            ;;
            -t=*|--daytime=*)
            DAYTIME="${i#*=}"
            shift # past argument=value
            ;;
            *)
                    # unknown option
            ;;
        esac
done
if [ "$FIRSTNAME" == "" ] && [ "$LASTNAME" == "" ]; then
        echo "Error : At least one name required"
elif [ "$DAYTIME" != "" ]; then
        #echo "daytime : $DAYTIME"
        SHOW="Good $DAYTIME"
        if [ "$FIRSTNAME" == "" ]; then
                SHOW="$SHOW $LASTNAME."
        elif [ "$LASTNAME" == "" ]; then
                SHOW="$SHOW $FIRSTNAME."
        else
                SHOW="$SHOW $FIRSTNAME $LASTNAME."
        fi
        echo $SHOW
else
        SHOW="Hello"
        if [ "$FIRSTNAME" == "" ]; then
                SHOW="$SHOW $LASTNAME."
        elif [ "$LASTNAME" == "" ]; then
                SHOW="$SHOW $FIRSTNAME."
        else
                SHOW="$SHOW $FIRSTNAME $LASTNAME."
        fi
        echo $SHOW
fi


