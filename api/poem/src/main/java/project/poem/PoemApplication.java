package project.poem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação Spring Boot Poem.
 * A anotação {@code @SpringBootApplication} é uma conveniência que agrupa as seguintes anotações:
 * {@code @Configuration}: Marca a classe como uma fonte de definições de beans para o contexto da aplicação.
 * {@code @EnableAutoConfiguration}: Diz ao Spring Boot para tentar configurar automaticamente sua aplicação Spring
 * com base nas dependências JAR que você adicionou.
 * {@code @ComponentScan}: Diz ao Spring para procurar outros componentes, configurações e serviços no pacote
 * `project.poem` e seus subpacotes.
 */
@SpringBootApplication
public class PoemApplication {

    /**
     * Método principal que inicia a aplicação Spring Boot.
     *
     * @param args Os argumentos de linha de comando passados para a aplicação.
     */
    public static void main(String[] args) {
        // Inicia a aplicação Spring Boot, configurando o ambiente e iniciando o servidor web (se aplicável).
        SpringApplication.run(PoemApplication.class, args);
    }

}