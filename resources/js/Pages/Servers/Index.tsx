import { InertiaLink } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
interface ComponentData {
    ram_name?: string;
    ram_capacity?: number;
    hard_drive_name?: string;
    hard_drive_capacity?: number;
    processor_name?: string;
    processor_speed?: number;
    power_supply_name?: string;
    power_supply_capacity?: number;
    motherboard_name?: string;
    motherboard_model?: string;
    network_card_name?: string;
    network_card_speed?: string;
    raid_controller_name?: string;
    raid_controller_type?: string;
    cooling_solution_name?: string;
    cooling_solution_type?: string;
    chassis_name?: string;
    chassis_type?: string;
    graphic_card_name?: string;
    graphic_card_memory?: number;
    fiber_optic_card_name?: string;
    fiber_optic_card_speed?: string;
    expansion_card_name?: string;
    expansion_card_type?: string;
  }
  
  interface ServerData {
    id: number; // L'ID du serveur
    server_name: string;
    brand: string;
    image: string | null;
    model: string;
  cpu_socket: string;
  ram_slots: number;
  storage_slots: number;
  power_supply_type: string;
  rack_mountable: boolean;
  form_factor: string;
    rams: ComponentData[];
    hardDrives: ComponentData[];
    processors: ComponentData[];
    powerSupplies: ComponentData[];
    motherboards: ComponentData[];
    networkCards: ComponentData[];
    raidControllers: ComponentData[];
    coolingSolutions: ComponentData[];
    chassis: ComponentData[];
    graphicCards: ComponentData[];
    fiberOpticCards: ComponentData[];
    expansionCards: ComponentData[];
  }
  
  interface Props {
    data: ServerData[];
  }
  
  const ServersIndex = ({ data }: Props) => {
    const handleDelete = (serverId: number) => {
      if (confirm("Êtes-vous sûr de vouloir supprimer ce serveur ?")) {
        // Utilisation d'Inertia.delete pour supprimer le serveur
        Inertia.delete(`/servers/${serverId}`);
      }
    };
  return (
    <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Rams
                    </h2>
                }
            >
      <h1>Liste des serveurs et composants</h1>
      <Link href="/servers/create" className="btn btn-primary">Ajouter Server</Link>
      {data.map((server, index) => (
        <div key={index}>
           {server.image ? (
            <div>
              <img src={`/storage/${server.image.url}`}  width="50" className="ml-2" />
            </div>
          ) : (
            <div>
              <p>{server.image}.</p>
            </div>
          )}


          <h3>Serveur: {server.server_name}</h3>
          <p>Marque: {server.brand}</p>
          <p>Modèle: {server.model}</p>
          <p>Socket CPU: {server.cpu_socket}</p>
          <p>Slots RAM: {server.ram_slots}</p>
          <p>Slots de stockage: {server.storage_slots}</p>
          <p>Type d'alimentation: {server.power_supply_type}</p>
          <p>Montage en rack: {server.rack_mountable ? 'Oui' : 'Non'}</p>
          <p>Form Factor: {server.form_factor}</p>

          {/* Affichage des RAMs seulement si elles existent */}
          {server.rams.length > 0 && (
            <>
              <h4>RAMs:</h4>
              {server.rams.map((ram, idx) => (
                <div key={idx}>
                  <p>{ram.ram_name} - {ram.ram_capacity} Go</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des disques durs seulement s'ils existent */}
          {server.hardDrives.length > 0 && (
            <>
              <h4>Disques Durs:</h4>
              {server.hardDrives.map((hardDrive, idx) => (
                <div key={idx}>
                  <p>{hardDrive.hard_drive_name} - {hardDrive.hard_drive_capacity} Go</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des processeurs seulement s'ils existent */}
          {server.processors.length > 0 && (
            <>
              <h4>Processeurs:</h4>
              {server.processors.map((processor, idx) => (
                <div key={idx}>
                  <p>{processor.processor_name} - {processor.processor_speed} GHz</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des alimentations seulement s'elles existent */}
          {server.powerSupplies.length > 0 && (
            <>
              <h4>Alimentations:</h4>
              {server.powerSupplies.map((powerSupply, idx) => (
                <div key={idx}>
                  <p>{powerSupply.power_supply_name} - {powerSupply.power_supply_capacity} W</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des cartes mères seulement si elles existent */}
          {server.motherboards.length > 0 && (
            <>
              <h4>Cartes Mères:</h4>
              {server.motherboards.map((motherboard, idx) => (
                <div key={idx}>
                  <p>{motherboard.motherboard_name} - {motherboard.motherboard_model}</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des cartes réseau seulement si elles existent */}
          {server.networkCards.length > 0 && (
            <>
              <h4>Cartes Réseau:</h4>
              {server.networkCards.map((networkCard, idx) => (
                <div key={idx}>
                  <p>{networkCard.network_card_name} - {networkCard.network_card_speed}</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des contrôleurs RAID seulement s'ils existent */}
          {server.raidControllers.length > 0 && (
            <>
              <h4>Contrôleurs RAID:</h4>
              {server.raidControllers.map((raidController, idx) => (
                <div key={idx}>
                  <p>{raidController.raid_controller_name} - {raidController.raid_controller_type}</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des solutions de refroidissement seulement si elles existent */}
          {server.coolingSolutions.length > 0 && (
            <>
              <h4>Solutions de Refroidissement:</h4>
              {server.coolingSolutions.map((coolingSolution, idx) => (
                <div key={idx}>
                  <p>{coolingSolution.cooling_solution_name} - {coolingSolution.cooling_solution_type}</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des châssis seulement s'ils existent */}
          {server.chassis.length > 0 && (
            <>
              <h4>Châssis:</h4>
              {server.chassis.map((chassis, idx) => (
                <div key={idx}>
                  <p>{chassis.chassis_name} - {chassis.chassis_type}</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des cartes graphiques seulement si elles existent */}
          {server.graphicCards.length > 0 && (
            <>
              <h4>Cartes Graphiques:</h4>
              {server.graphicCards.map((graphicCard, idx) => (
                <div key={idx}>
                  <p>{graphicCard.graphic_card_name} - {graphicCard.graphic_card_memory} Go</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des cartes optiques seulement si elles existent */}
          {server.fiberOpticCards.length > 0 && (
            <>
              <h4>Cartes Optiques:</h4>
              {server.fiberOpticCards.map((fiberOpticCard, idx) => (
                <div key={idx}>
                  <p>{fiberOpticCard.fiber_optic_card_name} - {fiberOpticCard.fiber_optic_card_speed}</p>
                </div>
              ))}
            </>
          )}

          {/* Affichage des cartes d'extension seulement si elles existent */}
          {server.expansionCards.length > 0 && (
            <>
              <h4>Cartes d'Extension:</h4>
              {server.expansionCards.map((expansionCard, idx) => (
                <div key={idx}>
                  <p>{expansionCard.expansion_card_name} - {expansionCard.expansion_card_type}</p>
                </div>
              ))}
            </>
          )}

          {/* Liens pour modifier, voir et supprimer le serveur */}
          <div className="action-buttons">
            <InertiaLink href={`/servers/${server.id}`} className="btn btn-info">Voir</InertiaLink>
            <InertiaLink href={`/servers/${server.id}/edit`} className="btn btn-warning">Modifier</InertiaLink>
            <button onClick={() => handleDelete(server.id)} className="btn btn-danger">Supprimer</button>
          </div>

          <hr />
        </div>
      ))}
    </AuthenticatedLayout>
  );
};

export default ServersIndex;
