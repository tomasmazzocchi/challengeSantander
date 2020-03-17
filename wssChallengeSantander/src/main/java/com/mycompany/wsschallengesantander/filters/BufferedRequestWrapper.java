package com.mycompany.wsschallengesantander.filters;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import org.apache.commons.io.IOUtils;

public final class BufferedRequestWrapper extends HttpServletRequestWrapper {

        private ByteArrayInputStream bais = null;
        private ByteArrayOutputStream baos = null;
        private BufferedServletInputStream bsis = null;        
        private byte[] buffer = null;
        

        public BufferedRequestWrapper(HttpServletRequest req) throws IOException {            
            super(req);                       
            InputStream is = req.getInputStream();
            this.baos = new ByteArrayOutputStream();
            byte buf[] = new byte[1024];
            int letti;
            while ((letti = is.read(buf)) > 0) {
                this.baos.write(buf, 0, letti);
            }
            this.buffer = this.baos.toByteArray();
        }

        
        @Override
        public ServletInputStream getInputStream() throws IOException {
            this.bais = new ByteArrayInputStream(this.buffer);
            this.bsis = new BufferedServletInputStream(this.bais, super.getInputStream());
            return this.bsis;
        }

        

        public String getRequestBody() throws IOException  {
           BufferedReader reader = new BufferedReader(new InputStreamReader(this.getInputStream()));
            return IOUtils.toString(reader);
        }

    }