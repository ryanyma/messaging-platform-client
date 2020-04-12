import React from 'react';
import Dropzone from 'react-dropzone';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const CREATE_FILE_MESSAGE = gql`
  mutation($channelId: Int!, $file: File) {
    createMessage(channelId: $channelId, file: $file)
  }
`;

export default function FileUpload({ children, disableClick, channelId, style = {} }) {
  const [createFileMessage] = useMutation(CREATE_FILE_MESSAGE);

  return (
    <Dropzone
      style={style}
      noClick={disableClick}
      onDrop={async ([file]) => {
        const response = await createFileMessage({
          variables: {
            channelId,
            file,
          },
        });
        console.log(response);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {children}
          </div>
        </section>
      )}
    </Dropzone>
  );
}
