package com.mycompany.wsschallengesantander.filters;

import java.io.ByteArrayInputStream;
import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;


public final class BufferedServletInputStream extends ServletInputStream {

        private final ByteArrayInputStream bais;
        private final ServletInputStream sis;

        public BufferedServletInputStream(ByteArrayInputStream bais, ServletInputStream sis) {
            this.bais = bais;
            this.sis = sis;
        }

        @Override
        public int available() {
            return this.bais.available();
        }

        @Override
        public int read() {
            return this.bais.read();
        }

        @Override
        public int read(byte[] buf, int off, int len) {
            return this.bais.read(buf, off, len);
        }

    @Override
    public boolean isFinished() {
        return sis.isFinished();
    }

    @Override
    public boolean isReady() {
        return sis.isReady();
    }

    @Override
    public void setReadListener(ReadListener rl) {
      sis.setReadListener(rl);
    }
 

    }